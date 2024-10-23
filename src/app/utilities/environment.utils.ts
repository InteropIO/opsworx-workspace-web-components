export namespace Environment {

  const location = window.location.host.toLowerCase();
  const environments = ['dev', 'localhost', 'sit', 'perf', 'uat'];

  export const environment = environments.find((env) => location.includes(env))!;

  export const isDev = location.includes('dev') || location.includes('localhost');
  export const isSit = location.includes('sit');
  export const isPerf = location.includes('perf');
  export const isUat = location.includes('uat');
  export const isProd = !isDev && !isSit && !isPerf && !isUat;
}
