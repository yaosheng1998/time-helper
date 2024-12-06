import { makeAutoObservable } from "mobx";

class HomeStore {
  constructor() {
    makeAutoObservable(this);
  }

  func() {
    console.log(1);
  }
}
export default HomeStore;
