const required = (value: string | undefined, name: string) => {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
};

export const ENV = {
  formDataKey: required(process.env.NEXT_PUBLIC_FORM_DATA_KEY, "NEXT_PUBLIC_FORM_DATA_KEY"),
  formDataEndpoint: required(process.env.NEXT_PUBLIC_FORM_DATA_ENDPOINT, "NEXT_PUBLIC_FORM_DATA_ENDPOINT"),
  googleAnalyticsID: required(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, "NEXT_PUBLIC_GOOGLE_ANALYTICS"),
};