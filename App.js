// Default export (React) plus named exports (hooks) pulled in via object destructuring.
import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
// Named imports from react-native let us reference components with <Component /> syntax.
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Static sample data for the dashboard cards and chart.
const voltageTrend = [12.1, 11.9, 12.3, 12.6, 12.4, 12.7, 12.5];
const sensorCards = [
  { label: 'Temperature', value: '24.5 C', detail: 'Stable', accent: '#0ea5e9' },
  { label: 'Humidity', value: '52 %', detail: 'Healthy band', accent: '#06b6d4' },
  { label: 'Voltage', value: '12.4 V', detail: 'Charging', accent: '#22c55e' },
  { label: 'Current', value: '1.8 A', detail: 'Nominal draw', accent: '#f97316' },
];
const activityFeed = [
  { label: 'Pump primed', time: '2m ago', tone: '#0ea5e9' },
  { label: 'Auto mode tuned', time: '12m ago', tone: '#06b6d4' },
  { label: 'Firmware ping OK', time: '26m ago', tone: '#22c55e' },
  { label: 'Light array trimmed', time: '1h ago', tone: '#f97316' },
];

export default function App() {
  // useState returns a pair [state, setter]; array destructuring pulls them into relays/setRelays.
  // Relay state mimics hardware toggles for quick visual feedback.
  const [relays, setRelays] = useState({
    pump: true,
    fan: false,
    lights: true,
    aux: false,
  });
  // Same pattern here; boolean drives the Auto/Manual pill.
  const [autoMode, setAutoMode] = useState(true);

  // Normalize voltage readings into bar heights while keeping a minimum size for visibility.
  // useMemo caches the derived array until dependencies change (empty array = run once).
  const bars = useMemo(() => {
    const max = Math.max(...voltageTrend);
    return voltageTrend.map((value, idx) => {
      // map returns a new array; arrow function returns an object literal for each bar.
      const height = Math.max(24, (value / max) * 90);
      // Template literal (`...`) injects the index to make a label like "T1".
      return { value, height, label: `T${idx + 1}` };
    });
  }, []);

  // Toggle a single relay flag by key.
  // Functional setState (prev => ...) ensures we read the latest state; spread clones the object.
  const toggleRelay = (key) => setRelays((prev) => ({ ...prev, [key]: !prev[key] }));

  // Keep browser tab title in sync when running on web.
  // useEffect with an empty dependency array runs once on mount; guard prevents document access on native.
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.title = 'expoTestApp';
    }
  }, []);

  // JSX lets us mix XML-like tags with JS. Parentheses here group the return value.
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero summary with system status, uptime, and quick stats */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.heroText}>
              <Text style={styles.overline}>Arduino Base</Text>
              <Text style={styles.title}>Control Deck</Text>
              <Text style={styles.subtitle}>
                Live link to your board with telemetry, control toggles, and quick tasks.
              </Text>
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
              <Text style={styles.statusHint}>Last sync 2s ago</Text>
            </View>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>Runtime</Text>
              <Text style={styles.heroStatValue}>6h 21m</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>Tasks Queued</Text>
              <Text style={styles.heroStatValue}>03</Text>
            </View>
            <View style={styles.heroStatBox}>
              <Text style={styles.heroStatLabel}>Ping</Text>
              <Text style={styles.heroStatValue}>18 ms</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensors</Text>
          {/* Sensor tiles mirror the latest telemetry snapshot */}
          <View style={styles.grid}>
            {/* map renders a component for each item; key helps React track list identity */}
            {sensorCards.map((item) => (
              <View key={item.label} style={styles.card}>
                {/* Style arrays merge base styles with overrides; later entries win */}
                <View style={[styles.tag, { backgroundColor: item.accent + '20' }]}>
                  <View style={[styles.tagDot, { backgroundColor: item.accent }]} />
                  <Text style={[styles.tagText, { color: item.accent }]}>{item.label}</Text>
                </View>
                <Text style={styles.cardValue}>{item.value}</Text>
                <Text style={styles.cardHint}>{item.detail}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Power trend</Text>
            <Text style={styles.sectionHint}>Voltage over last syncs</Text>
          </View>
          {/* Minimal bar chart to avoid pulling in a charting dependency */}
          <View style={styles.chartCard}>
            <View style={styles.chartRow}>
              {bars.map((bar) => (
                <View key={bar.label} style={styles.barCol}>
                  <View style={[styles.bar, { height: bar.height }]} />
                  <Text style={styles.barLabel}>{bar.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartFooter}>
              <View>
                <Text style={styles.chartTitle}>12.7 V peak</Text>
                <Text style={styles.chartHint}>Holding smooth across recent samples</Text>
              </View>
              <View style={styles.footerChip}>
                <Text style={styles.footerChipText}>Safe load</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Relays and modes</Text>
            <TouchableOpacity
              style={[styles.switchPill, autoMode ? styles.switchOn : styles.switchOff]}
              // Inline arrow function flips the boolean; ternary picks matching styles.
              onPress={() => setAutoMode((prev) => !prev)}
              activeOpacity={0.85}
            >
              <View style={styles.switchKnobWrapper}>
                {/* Logical AND means "add this style only when autoMode is true" */}
                <View style={[styles.switchKnob, autoMode && styles.switchKnobOn]} />
              </View>
              <Text style={[styles.switchLabel, autoMode ? styles.switchLabelOn : styles.switchLabelOff]}>
                {autoMode ? 'Auto' : 'Manual'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.controlsCard}>
            {/* Relay rows mirror physical toggles and show live state */}
            {Object.entries(relays).map(([key, isOn]) => (
              <TouchableOpacity
                key={key}
                style={[styles.controlRow, isOn ? styles.controlOn : styles.controlOff]}
                onPress={() => toggleRelay(key)}
                activeOpacity={0.9}
              >
                <View>
                  <Text style={styles.controlLabel}>{key.toUpperCase()}</Text>
                  <Text style={styles.controlHint}>
                    {isOn ? 'Active and within limits' : 'Standby - tap to arm'}
                  </Text>
                </View>
                <View style={[styles.toggle, isOn ? styles.toggleOn : styles.toggleOff]}>
                  <View style={[styles.toggleDot, isOn ? styles.toggleDotOn : styles.toggleDotOff]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {/* Lightweight activity log to verify commands and telemetry updates */}
          <View style={styles.activityCard}>
            {activityFeed.map((item, idx) => (
              <View key={item.label} style={[styles.activityRow, idx !== activityFeed.length - 1 && styles.activityDivider]}>
                <View style={[styles.activityDot, { backgroundColor: item.tone }]} />
                <View style={styles.activityTextBlock}>
                  <Text style={styles.activityLabel}>{item.label}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
                <View style={styles.activityChip}>
                  <Text style={styles.activityChipText}>Logged</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Each key here is a style object; referenced via styles.someName.
  screen: {
    flex: 1,
    backgroundColor: '#e9edf5',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#0b1224',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroText: {
    flex: 1,
  },
  overline: {
    color: '#7dd3fc',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    marginTop: 6,
    lineHeight: 20,
  },
  statusPill: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 120,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#ecfeff',
    marginBottom: 6,
  },
  statusText: {
    color: '#ecfeff',
    fontWeight: '700',
    fontSize: 16,
  },
  statusHint: {
    color: '#e0f2fe',
    fontSize: 12,
    marginTop: 2,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: '#111a30',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#14203a',
  },
  heroStatLabel: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 6,
  },
  heroStatValue: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionHint: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#93a1c5',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  tagDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginRight: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardValue: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '700',
  },
  cardHint: {
    color: '#6b7280',
    marginTop: 6,
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#93a1c5',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 16,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
  },
  barLabel: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 12,
  },
  chartFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  chartHint: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 13,
  },
  footerChip: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  footerChipText: {
    color: '#ecfeff',
    fontWeight: '700',
  },
  switchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  switchOn: {
    backgroundColor: '#0ea5e920',
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  switchOff: {
    backgroundColor: '#e5e7eb',
  },
  switchKnobWrapper: {
    width: 36,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginRight: 10,
  },
  switchKnob: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  switchKnobOn: {
    alignSelf: 'flex-end',
    backgroundColor: '#0ea5e9',
  },
  switchLabel: {
    fontWeight: '700',
    fontSize: 14,
  },
  switchLabelOn: {
    color: '#0f172a',
  },
  switchLabelOff: {
    color: '#475569',
  },
  controlsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    gap: 10,
    shadowColor: '#93a1c5',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  controlOn: {
    borderColor: '#0ea5e9',
    backgroundColor: '#f0f9ff',
  },
  controlOff: {
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  controlLabel: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  controlHint: {
    color: '#6b7280',
    marginTop: 4,
    fontSize: 13,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: '#0ea5e9',
  },
  toggleOff: {
    backgroundColor: '#cbd5e1',
  },
  toggleDot: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  toggleDotOn: {
    alignSelf: 'flex-end',
  },
  toggleDotOff: {
    alignSelf: 'flex-start',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#93a1c5',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  activityDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 8,
  },
  activityTextBlock: {
    flex: 1,
  },
  activityLabel: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 15,
  },
  activityTime: {
    color: '#6b7280',
    marginTop: 2,
    fontSize: 13,
  },
  activityChip: {
    backgroundColor: '#0ea5e920',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  activityChipText: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
