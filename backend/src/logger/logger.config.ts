import { WinstonModuleOptions } from 'nest-winston';
import { transports, format } from 'winston';
import { utilities as nestWinstonUtilities } from 'nest-winston';

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(), // gives the "+4ms" suffix
        nestWinstonUtilities.format.nestLike('Nest', {
          colors: true,      // ← red errors, yellow warns, green logs
          prettyPrint: true,
        }),
      ),
    }),
    // add a file transport later if you want persisted logs:
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
};
