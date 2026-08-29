import type { PageLayoutType } from "../../store/preferences/types";
export declare function useLayoutMenu(): {
    pageLayout: PageLayoutType;
    setPageLayout: (value: PageLayoutType) => void;
    layoutButtonTrigger: import("#node_modules/@types/react").JSX.Element;
};
