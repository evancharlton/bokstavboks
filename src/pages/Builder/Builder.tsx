import { Link } from "react-router-dom";

export const Builder = () => {
  return (
    <div>
      <Link to="./id">Build by ID</Link>
      <Link to="./words">Build with words</Link>
    </div>
  );
};
