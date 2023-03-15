/** Types generated for queries found in "src/store/list.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type stringArray = (string)[];

/** 'FindList' parameters type */
export type IFindListParams = void;

/** 'FindList' return type */
export interface IFindListResult {
  creator_discord_ids: stringArray | null;
  creator_ids: stringArray | null;
  creator_names: stringArray | null;
  creator_nationalities: stringArray | null;
  gd_id: string | null;
  id: string | null;
  name: string | null;
  rank: number | null;
  requirement: number | null;
  user_discord_id: string | null;
  user_id: string | null;
  user_name: string | null;
  user_nationality: string | null;
  verifier_discord_id: string | null;
  verifier_id: string | null;
  verifier_name: string | null;
  verifier_nationality: string | null;
  video: string | null;
}

/** 'FindList' query type */
export interface IFindListQuery {
  params: IFindListParams;
  result: IFindListResult;
}

const findListIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM list"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM list
 * ```
 */
export const findList = new PreparedQuery<IFindListParams,IFindListResult>(findListIR);


