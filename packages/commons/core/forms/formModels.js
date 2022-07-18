export function base64EncodedFile({ dataUrl } = {}) {
  try {
    return {
      dataUrl,
      base64String: dataUrl.split(',').pop(),
    };
  } catch (err) {
    return undefined;
  }
}
