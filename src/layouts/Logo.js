import { Link } from "react-router-dom";
import React from "react";

const Logo = () => {
  return (
    <Link to="/">
      <img src="/logo.png"  alt=""/>
    </Link>
  );
};

export default Logo;
