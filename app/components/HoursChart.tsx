import React from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import {
  Canvas,
  Rect,
  Group,
} from "@shopify/react-native-skia";

const width = Dimensions.get("window").width * 0.85;
const barHeight = 20;
const barSpacing = 60;
const leftMargin = 75;
const rightMargin = 50;
const chartHeight = 2 * barSpacing + 20;

const statuses = [
  { key: "5hrs", color: "#99C9FF", label: "5 HOURS" },
  { key: "4.5hrs", color: "#001F54", label: "4.5 HOURS" },
  { key: "4hrs", color: "#FF7018", label: "4 HOURS" },
  { key: "no_info", color: "#D9D9D9", label: "NO INFORMATION" },

];

type ChartData = {
  country: string;
  values: {
    [key: string]: number;
  };
};

interface Props {
  data: ChartData[];
}

export default function HoursChart({ data }: Props) {
  const maxTotal = Math.max(
    ...data.map((d) =>
      Object.values(d.values).reduce((sum, v) => sum + v, 0)
    )
  );

  return (
    <View style={styles.wrapper}>
      {/* Title */}
      <Text style={styles.title}>HOURS IN SCHOOL</Text>

      {/* Legend */}
      <View style={styles.legendRow}>
        {statuses.map((s) => (
          <View key={s.key} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Chart Bars */}
      <Canvas style={{ width, height: chartHeight }}>
        {data.map((row, i) => {
          let x = leftMargin;
          const barY = i * barSpacing + 10;

          return (
            <Group key={row.country}>
              {statuses.map((s) => {
                const val = row.values[s.key] || 0;
                const barWidth =
                  (val / maxTotal) * (width - leftMargin - rightMargin);

                const rect = (
                  <Rect
                    key={s.key}
                    x={x}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    color={s.color}
                  />
                );

                x += barWidth;
                return rect;
              })}
            </Group>
          );
        })}
      </Canvas>

      {/* Labels beside bars */}
      <View style={styles.labelsContainer}>
        {data.map((row, i) => {
          const total = Object.values(row.values).reduce(
            (sum, v) => sum + v,
            0
          );
          const y = i * barSpacing + 10;

          return (
            <View
              key={row.country}
              style={[styles.labelRow, { top: y, height: barHeight }]}
            >
              <Text style={styles.countryLabel}>{row.country}</Text>
              <Text style={styles.totalLabel}>{total}</Text>
            </View>
          );
        })}
      </View>

      {/* X-Axis Labels */}
      <View style={styles.axisLabels}>
        {["0%", "25%", "50%", "75%", "100%"].map((label, i) => (
          <Text key={label} style={styles.axisText}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "90%",
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,

  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    marginVertical: 4,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: "#333",
  },
  labelsContainer: {
    position: "absolute",
    left: 20,
    top: 98,
    width: width - 40,
  },
  labelRow: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 40,
    paddingRight: 10,
    alignItems: "center",
  },
  countryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
  },
  totalLabel: {
    left: 30,
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  axisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  axisText: {
    paddingLeft: 30,
    fontSize: 10,
    color: "#333",
  },
});