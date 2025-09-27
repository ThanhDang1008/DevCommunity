"use client";
import { useEffect } from "react";
import { increaseViewPost } from "./actions";

type IncreaseViewProps = {
  slug: string;
};

const IncreaseView = (props: IncreaseViewProps) => {
  useEffect(() => {
    const increaseView = async () => {
      const response = await increaseViewPost(props.slug);
      //console.log("Increase view count ", response);
    };

    const timeout = setTimeout(() => {
      increaseView();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return <></>;
};

export default IncreaseView;
