import { MetaInterface } from "@interfaces/meta.interface";
import { OpenaiInterface } from "@interfaces/openai.interface";
import { InterestInterface } from "@interfaces/interest.interface";

export interface HistoryInterface {
  time?: number;
  meta?: MetaInterface;
  openai?: OpenaiInterface;
  interest?: InterestInterface;
}
