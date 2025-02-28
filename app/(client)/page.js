import CategoryList from "components/Client/Common/CategoryList ";
import FeatureProducts from "components/Client/Product/FeatureProducts";
import NewProducts from "components/Client/Product/NewProducts";
import Slider from "components/Client/Product/Slider";
import ViewAll from "components/Client/ViewAll";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Slider />
      <div className="py-2 my-8 container">
        <h2 className="mb-4 ">Feature products</h2>
        <FeatureProducts />
        <ViewAll />
      </div>
      <CategoryList />
      <div className="py-2 my-8 container">
        <h2 className="mb-3 ">New products</h2>
        <NewProducts />
        <ViewAll />
      </div>
    </div>
  );
};

export default HomePage;
