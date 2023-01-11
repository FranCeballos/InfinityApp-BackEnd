import ContainerFiles from "../../containers/ContainerFiles.js";

class ContainerDaoFiles extends ContainerFiles {
  constructor() {
    super("./DB/products.json");
  }
}

export default ContainerDaoFiles;
