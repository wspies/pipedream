export default {
  name: "Map Tradelinq Products",
  version: "0.0.1",
  key: "map-tradelinq-products",
  description: "",
  props: {
    sku: {
      type: "string",
      label: "sku",
      description: "Tradelinq field used for the Propeller SKU",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    $.export("name", "value");
    return $.flow.exit("end reason");
  },
};
