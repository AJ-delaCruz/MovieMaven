import { MovieType } from "./movie";

export interface ButtonType {
    movie: MovieType;
    colorTheme?: "menu" | "card";
}
