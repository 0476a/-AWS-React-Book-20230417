import { atom } from "recoil";

// atom을 상태 하나하나를 뜻함
export const authenticatedState = atom({
    key: "authenticatedState",
    default: false
});

