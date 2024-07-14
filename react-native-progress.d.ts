declare module "react-native-progress/Bar" {
  import { Component } from "react";
  import { ViewStyle } from "react-native";

  interface ProgressBarProps {
    progress: number;
    indeterminate?: boolean;
    width?: number | null;
    height?: number;
    borderWidth?: number;
    borderRadius?: number;
    borderColor?: string;
    unfilledColor?: string;
    color?: string;
    children?: React.ReactNode;
    style?: ViewStyle;
  }

  export default class ProgressBar extends Component<ProgressBarProps> {}
}
