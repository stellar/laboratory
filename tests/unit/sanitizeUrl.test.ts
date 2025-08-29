import { sanitizeUrl } from "../../src/helpers/sanitizeUrl";

describe("sanitizeUrl", () => {
  it("should return an empty string for invalid URLs", () => {
    expect(sanitizeUrl("not a url")).toBe("");
  });

  it("should return an empty string for disallowed protocols", () => {
    expect(sanitizeUrl("ftp://stellar.org")).toBe("");
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
    expect(sanitizeUrl("ws://stellar.org")).toBe("");
  });

  it("should allow http and https protocols", () => {
    expect(sanitizeUrl("https://stellar.org")).toBe("https://stellar.org");
    expect(sanitizeUrl("http://stellar.org")).toBe("http://stellar.org");
  });

  it("should handle URLs with query parameters", () => {
    expect(sanitizeUrl("https://stellar.org?foo=bar&baz=qux")).toBe(
      "https://stellar.org/?foo=bar&baz=qux",
    );
  });

  it("should sanitize query parameters to prevent XSS", () => {
    const unsafeUrl = "https://stellar.org?param=<script>alert('xss')</script>";
    const expectedUrl =
      "https://stellar.org/?param=%26lt%3Bscript%26gt%3Balert%28%27xss%27%29%26lt%3B%2Fscript%26gt%3B";
    expect(sanitizeUrl(unsafeUrl)).toBe(expectedUrl);
  });

  it("should handle multiple query parameters with sanitization", () => {
    const unsafeUrl =
      "https://stellar.org?p1=normal&p2=<script>alert('xss')</script>&p3=another";
    const expectedUrl =
      "https://stellar.org/?p1=normal&p2=%26lt%3Bscript%26gt%3Balert%28%27xss%27%29%26lt%3B%2Fscript%26gt%3B&p3=another";
    expect(sanitizeUrl(unsafeUrl)).toBe(expectedUrl);
  });

  it("should allow localhost URLs", () => {
    expect(sanitizeUrl("http://localhost:3000/some/path")).toBe(
      "http://localhost:3000/some/path",
    );
  });

  it("should preserve path", () => {
    expect(sanitizeUrl("https://stellar.org/some/path")).toBe(
      "https://stellar.org/some/path",
    );
  });

  it("should not return a URL with a trailing slash if the path is empty", () => {
    expect(sanitizeUrl("https://stellar.org")).toBe("https://stellar.org");
  });

  it("should remove trailing slash from path", () => {
    expect(sanitizeUrl("https://stellar.org/")).toBe("https://stellar.org");
    expect(sanitizeUrl("https://stellar.org/some/path/")).toBe(
      "https://stellar.org/some/path",
    );
    expect(sanitizeUrl("https://stellar.org/some/path/?foo=bar")).toBe(
      "https://stellar.org/some/path?foo=bar",
    );
  });
});
