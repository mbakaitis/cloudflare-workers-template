/**
 * Minimal Worker entry point used as the template's extension surface.
 *
 * @type {ExportedHandler}
 */
export default {
  /**
   * Return a basic health response while the template has no application logic.
   *
   * @returns {Response}
   */
  fetch() {
    return new Response("OK");
  },
};
