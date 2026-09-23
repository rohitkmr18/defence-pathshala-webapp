from fastapi import FastAPI

app = FastAPI(
    title="Defence Pathshala PYQ Intelligence API",
    version="0.1.0",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "pyq-intelligence-api",
        "version": "0.1.0",
    }