import mapboxgl from 'mapbox-gl';

export function configure({
  accessToken,
  rtlTextPluginUrl,
}: {
  accessToken: string;
  rtlTextPluginUrl: string;
}): void {
  mapboxgl.accessToken = accessToken;
  mapboxgl.setRTLTextPlugin(rtlTextPluginUrl, (err) => {
    throw err;
  });
}
