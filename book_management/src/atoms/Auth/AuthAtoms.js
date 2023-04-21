import { atom } from "recoil";

export const refreshState = atom({
    key: "refreshState",
    default: true
});

// atom을 상태 하나하나를 뜻함
export const authenticatedState = atom({
    key: "authenticatedState",
    default: false
});

