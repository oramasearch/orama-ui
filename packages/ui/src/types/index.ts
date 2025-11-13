import { Hit } from "@orama/core";
import { ComponentProps, ElementType, ReactNode } from "react";

export type PolymorphicComponentProps<T extends ElementType, P = object> = P & {
  as?: T;
  children?: ReactNode;
} & Omit<ComponentProps<T>, keyof P | "as" | "children">;

export type GroupCount = {
  count: number;
  name: string;
};

export type GroupsCount = GroupCount[];

export type GroupedResult = GroupCount & {
  hits: Hit[];
};

export type GroupedResults = GroupedResult[];

export type Lang =
  | 'arabic'
  | 'english'
  | 'french'
  | 'german'
  | 'italian'
  | 'japanese'
  | 'portuguese'
  | 'russian'
  | 'spanish'
  | 'turkish'
  | 'armenian'
  | 'bulgarian'
  | 'danish'
  | 'dutch'
  | 'finnish'
  | 'greek'
  | 'hungarian'
  | 'indonesian'
  | 'norwegian'
  | 'romanian'
  | 'swedish'
  | 'ukrainian'
  | 'indian'
  | 'irish'
  | 'lithuanian'
  | 'mandarin'
  | 'nepali'
  | 'sanskrit'
  | 'serbian'
  | 'slovenian'
  | 'tamil'
