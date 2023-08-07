import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const initialState: LayoutInitialState = {
  isLeftMenuOpen: false,
  isDarkMode: localStorage.getItem("darkMode") === '1'
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleLeftMenu: (state) => {
      state.isLeftMenuOpen = !state.isLeftMenuOpen
    },
    toggleDarkMode: (state) => {
      const newState = !state.isDarkMode

      localStorage.setItem("darkMode", newState ? '1' : '0')
      state.isDarkMode = newState
    }
  }
})

export const { toggleLeftMenu, toggleDarkMode } = layoutSlice.actions

export const selectIsLeftMenuOpen = (state: RootState) => state.layout.isLeftMenuOpen
export const selectIsDarkMode = (state: RootState) => state.layout.isDarkMode

export default layoutSlice.reducer