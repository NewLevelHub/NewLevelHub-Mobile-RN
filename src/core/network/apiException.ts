export class ApiException extends Error {
  readonly code?: string;
  readonly statusCode?: number;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(options: {
    code?: string;
    message: string;
    statusCode?: number;
    fieldErrors?: Record<string, string[]>;
  }) {
    super(options.message);
    this.name = 'ApiException';
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.fieldErrors = options.fieldErrors;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  fieldError(fieldName: string): string | undefined {
    const errors = this.fieldErrors?.[fieldName];
    return errors?.[0];
  }
}

export class EmailNotVerifiedException extends ApiException {
  static readonly emailNotVerifiedCode = 'EMAIL_NOT_VERIFIED';

  constructor(options: {
    message: string;
    statusCode?: number;
    fieldErrors?: Record<string, string[]>;
  }) {
    super({
      code: EmailNotVerifiedException.emailNotVerifiedCode,
      message: options.message,
      statusCode: options.statusCode ?? 403,
      fieldErrors: options.fieldErrors,
    });
    this.name = 'EmailNotVerifiedException';
  }
}
