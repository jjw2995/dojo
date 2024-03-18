const orderModes = ["TABLE", "TOGO", "ONLINE"] as const;
type orderMode = (typeof orderModes)[number];
export { orderModes, type orderMode };
