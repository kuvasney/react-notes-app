import Navigator from "../Navigator";

import "./Header.scss";

export default function Header() {
  return (
    <div className="page-header">
      <h1 className="hwr">Take Note!</h1>
      <Navigator />
    </div>
  );
}
