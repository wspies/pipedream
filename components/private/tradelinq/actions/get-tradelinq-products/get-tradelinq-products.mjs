import ftp from "basic-ftp";
import xmlParser from "xml2js-es6-promise";
import fs from "fs";

export default {
  name: "get_tradelinq_products",
  version: "0.0.23",
  key: "get_tradelinq_products",
  description: "",
  props: {
    ftp: {
      type: "string",
      label: "Ftp address",
      description: "Ftp address of the tradelinq account",
    },
    userName: {
      type: "string",
      label: "Username",
      description: "Username for the Tradelinq FTP account",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password for the Tradelinq FTP account",
    },
    changesOnly: {
      type: "boolean",
      label: "Changed products only",
      description: "Process changed products only (Quantore needs to enable this on their side)",
    },
    renameFiles: {
      type: "boolean",
      label: "Rename files after processing",
      description: "Rename the processed files on the ftp after processing (to make sure these are not processed again)",
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {

    const client = new ftp.Client();
    client.ftp.verbose = true;

    await client.access({
      host: this.ftp,
      user: this.userName,
      password: this.password,
      secure: false,
    });

    console.log(await client.list());

    await client.cd("/Product");
    console.log(await client.list());

    await client.downloadTo("/tmp/product.xml", "PRODUCT.xml");
    console.log("File downloaded");
    console.log(await fs.readdirSync("/tmp"));

    const productFile = await fs.promises.readFile("/tmp/product.xml");
    const productData = productFile.toString();
    const productJson =  await xmlParser(productData);
    //console.log(JSON.stringify(productJson));

    //var data = JSON.parse(productJson);

    //const xmlDoc = libxmljs.parseXml(productData);
    //let jObj = fastParser.parse(productData);
    console.log("Number of products:" + productJson.Quantore_Artikel.Product.length);

    //for (const product in productJson.Quantore_Artikel.Product)

    //  console.log( productJson.Quantore_Artikel.Product[product].ProductCodeSupplier);

    $.export("products", productJson);
    return $.flow.exit("end reason");
  },
};
