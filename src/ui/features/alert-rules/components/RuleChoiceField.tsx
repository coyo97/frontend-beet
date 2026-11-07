
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { styles } from "../styles/AlertRuleEditor.styles";

export interface RuleOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string;
  options: readonly RuleOption[];
  onChange: (value: string) => void;
}

export default function RuleChoiceField({
  label,
  value,
  options,
  onChange,
}: Props) {
  const [visible, setVisible] = useState(false);

  const current = options.find(
    (option) => option.value === value
  );

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={styles.choice}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.choiceText}>
          {current?.label ?? value}
        </Text>
        <Text style={styles.accent}>Cambiar</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalPanel}>
            <Text style={styles.modalTitle}>
              {label}
            </Text>

            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  style={styles.option}
                  onPress={() => {
                    onChange(option.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {option.label}
                  </Text>

                  {option.value === value && (
                    <Text style={styles.accent}>✓</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={styles.buttonSecondary}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.buttonText}>
                Cerrar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

