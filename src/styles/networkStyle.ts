export const MAIN_COLORS={
    nodeColor:"#0a0a0a", // Background 
    primaryColor:"springgreen",// Edge Color and border Color
    deleteColor: "red", // Delete Hover Color
    edgeWeightColor:"#00c8ff", 
    edgeWeightStroke:"#9500ff",
}
export const BIPARTITION_COLORS={
    stableColor1: "#C6DE21",
    stableColor2: "#00B0FF",
    neutralColor: "white",
    nodeLabel: "#202121",
    edges: "#00FF7F"
}
export const HOVER_COLORS={
    label: "#ff00a2",
    border: "#cf0083"
}
export const FONTS={
    main: {
        color:MAIN_COLORS.primaryColor,
        strokeColor:MAIN_COLORS.nodeColor
    },
    bipartite:{
        color:BIPARTITION_COLORS.nodeLabel,
        stroke:BIPARTITION_COLORS.nodeLabel
    }
}