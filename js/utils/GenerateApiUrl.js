function generateApiUrl(template, params) {
  return template.replace(/:([a-zA-Z]+)/g, (_, key) => {
    if (key in params) {
      return encodeURIComponent(params[key]);
    }
    return encodeURIComponent(`missing-${key}`);
  });
}
