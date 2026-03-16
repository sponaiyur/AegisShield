import argparse
import json
import mimetypes
import time
import uuid
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


def _request_json(method: str, url: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = Request(url=url, data=data, headers=headers, method=method)
    with urlopen(req, timeout=8) as resp:
        body = resp.read().decode("utf-8")
        return json.loads(body)


def _multipart_body(field_name: str, file_path: Path) -> tuple[bytes, str]:
    boundary = f"----AegisBoundary{uuid.uuid4().hex}"
    mime, _ = mimetypes.guess_type(file_path.name)
    mime = mime or "application/octet-stream"

    file_bytes = file_path.read_bytes()

    parts = [
        f"--{boundary}\r\n".encode("utf-8"),
        (
            f'Content-Disposition: form-data; name="{field_name}"; '
            f'filename="{file_path.name}"\r\n'
        ).encode("utf-8"),
        f"Content-Type: {mime}\r\n\r\n".encode("utf-8"),
        file_bytes,
        b"\r\n",
        f"--{boundary}--\r\n".encode("utf-8"),
    ]
    return b"".join(parts), boundary


def _request_file_upload(url: str, field_name: str, file_path: Path) -> dict[str, Any]:
    body, boundary = _multipart_body(field_name, file_path)
    req = Request(
        url=url,
        data=body,
        method="POST",
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def wait_for_server(base_url: str, retries: int = 20, delay_sec: float = 1.0) -> None:
    last_error: str | None = None
    for _ in range(retries):
        try:
            data = _request_json("GET", f"{base_url}/health")
            if data.get("status") == "ok":
                return
            last_error = f"Unexpected health payload: {data}"
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = str(exc)
        time.sleep(delay_sec)

    raise RuntimeError(f"Server did not become healthy. Last error: {last_error}")


def run_checks(base_url: str, sample_image: Path) -> None:
    print("[1/3] Checking /health ...")
    health = _request_json("GET", f"{base_url}/health")
    _assert(health.get("status") == "ok", f"Invalid /health response: {health}")
    _assert("version" in health, f"Missing version in /health response: {health}")
    print(f"PASS /health -> {health}")

    print("[2/3] Checking /classify ...")
    classify = _request_json(
        "POST",
        f"{base_url}/classify",
        payload={"text": "Bill Gates controls COVID vaccines"},
    )
    expected_keys = {"label", "fake_probability", "true_probability", "confidence"}
    _assert(expected_keys.issubset(classify.keys()), f"Invalid /classify keys: {classify}")
    _assert(classify["label"] in {"fake", "true", "real"}, f"Invalid label: {classify}")
    _assert(0.0 <= float(classify["fake_probability"]) <= 1.0, f"Invalid fake_probability: {classify}")
    _assert(0.0 <= float(classify["true_probability"]) <= 1.0, f"Invalid true_probability: {classify}")
    _assert(classify["confidence"] in {"low", "medium", "high"}, f"Invalid confidence: {classify}")
    print(f"PASS /classify -> {classify}")

    print("[3/3] Checking /extract-text ...")
    _assert(sample_image.exists(), f"Sample image not found: {sample_image}")
    ocr = _request_file_upload(f"{base_url}/extract-text", "file", sample_image)
    _assert("extracted_text" in ocr, f"Invalid /extract-text response: {ocr}")
    _assert(isinstance(ocr["extracted_text"], str), f"OCR result is not text: {ocr}")
    print(f"PASS /extract-text -> extracted_text length={len(ocr['extracted_text'])}")


def main() -> int:
    parser = argparse.ArgumentParser(description="AegisShield backend endpoint health check")
    parser.add_argument("--base-url", default="http://127.0.0.1:8000", help="Backend base URL")
    parser.add_argument(
        "--sample-image",
        default=str(Path(__file__).resolve().parents[2] / "data" / "samples" / "sample_image.png"),
        help="Path to sample image used for /extract-text",
    )
    args = parser.parse_args()

    base_url = args.base_url.rstrip("/")
    sample_image = Path(args.sample_image)

    print(f"Waiting for server at {base_url} ...")
    wait_for_server(base_url)

    run_checks(base_url, sample_image)
    print("\nAll endpoint checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
