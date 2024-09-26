// NewContentPage.tsx (Server Component)

import React from "react";
import InnerTemplate from "../_components/InnerTemplate";

interface PROPS {
  params: {
    "template-slug": string;
  };
}

const NewContentPage = ({ params }: PROPS) => {
  const pageSlug = params["template-slug"];

  return <InnerTemplate pageSlug={pageSlug} />;
};

export default NewContentPage;
