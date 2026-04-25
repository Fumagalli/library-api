import { describe, it, expect, vi } from "vitest";

// Mock dbConnect before importing app handlers
vi.mock("./config/dbConnect.js", () => ({
  default: vi.fn(async () => ({
    on: vi.fn(),
    once: vi.fn(),
  })),
}));

const { handleConnectionError, handleConnectionOpen } =
  await import("./app.js");

describe("app.js - Connection Handlers", () => {
  it("should log error on connection error event", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const testError = new Error("Test database error");

    handleConnectionError(testError);

    expect(consoleError).toHaveBeenCalledWith("Erro de conexão", testError);
    consoleError.mockRestore();
  });

  it("should log success on connection open event", () => {
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

    handleConnectionOpen();

    expect(consoleLog).toHaveBeenCalledWith(
      "Conexão com o banco feita com sucesso"
    );
    consoleLog.mockRestore();
  });
});
