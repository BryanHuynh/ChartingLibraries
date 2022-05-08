
export interface IHoleBaseData {
    id: number;
    serieId: string;
    name: string;
    layers: ILayer[];
    start: number;
    end: number;
    total_depth: number;
}

export interface ILayer {
    name: string;
    color: string;
    depth: number;
}

interface IData {
    // popup tool information
}