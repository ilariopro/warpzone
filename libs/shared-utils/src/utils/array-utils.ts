const removeFalsyFromArray = <T>(array?: T[]) => (array ? array.filter(Boolean) : []);

export { removeFalsyFromArray };
