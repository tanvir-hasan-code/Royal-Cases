import { useEffect } from "react";

/**
 * usePageTitle hook
 * @param {string} title - Page/Section title
 */
const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} ` : "Royal Cases";
  }, [title]);
};

export default usePageTitle;
