class Data {
  name: string;
  series: Series[];
}

class Series {
  name: string;
  value: number | any;
}

export { Data, Series }
