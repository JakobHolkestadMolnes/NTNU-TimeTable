import chalk from "chalk";

/**
 * Logging class for logging messages to the console.
 *      - Logs to the console with a timestamp.
 *      - Has support for diferrent log levels. (info, warn, error)
 *      - different log levels have different colors.
 * @class Logging
 * @classdesc Logging class
 * @version 1.0
 * @author Jakob Holkestad Molnes
 */
export default class Logging {


    /**
     * Shorthand for the info log level.
     * @param args - The arguments to log.
     * @returns nothing
     */
    public static log = (args: any) => this.info(args);

    /**
     * Logs a message with the info log level.
     * The message is logged with a timestamp.
     * The message is also logged with a blue color.
     * @param args - The arguments to log.
     * @returns nothing
     */
    public static info = (args: any) => console.log(chalk.blue(`[${new Date().toLocaleString()}] [INFO] `, typeof args === 'string' ? chalk.blueBright(args) : args));

    /**
     * Logs a message with the warn log level.
     * The message is logged with a timestamp.
     * The message is also logged with a yellow color.
     * @param args - The arguments to log.
     * @returns nothing
     */
    public static warn = (args: any) => console.log(chalk.yellow(`[${new Date().toLocaleString()}] [WARN] `, typeof args === 'string' ? chalk.yellowBright(args) : args));

    /**
     * Logs a message with the error log level.
     * The message is logged with a timestamp.
     * The message is also logged with a red color.
     * @param args - The arguments to log.
     * @returns nothing
     */
    public static error = (args: any) => console.log(chalk.red(`[${new Date().toLocaleString()}] [ERROR] `, typeof args === 'string' ? chalk.redBright(args) : args));
}