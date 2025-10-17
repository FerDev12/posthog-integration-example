export type ActionError = {
  status: number;
  code: string;
  title: string;
  message: string;
};

export type ActionResult<T = unknown> =
  | {
      data: T;
      success: true;
      error: null;
    }
  | { data: null; success: false; error: ActionError };
