import { Dict } from "../utils/dataUtils.js";
import cli from "./cli.js";
import CLIUtils from "./cliUtils.js";


export abstract class CLICMD {

    public abstract name: string;
    public abstract description: string;
    public abstract usage: string;

    public abstract run(args: string[], parent_args: string[]): Promise<void>;

}

export abstract class CLISubCMD extends CLICMD {
    
    protected readonly registry: Dict<CLICMD> = {};

    protected constructor() {
        super();
        this.registerCommands();
    }

    protected abstract registerCommands(): void;

    protected register(command: CLICMD) {
        this.registry[command.name.toLowerCase()] = command;
    }

    protected async run_help(parent_args: string[]) {
        const parent_args_str = CLIUtils.parsePArgs(parent_args, true);

        let help_message = "Available commands:\n" +
                           ` - ${parent_args_str}help: Show available commands`;

        for (const cmd of Object.values(this.registry)) {
            help_message += `\n - ${parent_args_str}${cmd.name}: ${cmd.description}`;
        }

        cli.default.info(help_message);
    }

    protected async run_empty(parent_args: string[]) {
        return await this.run_help(parent_args);
    }

    protected async run_notFound(command_name: string, parent_args: string[]) {
        const parent_args_str = CLIUtils.parsePArgs(parent_args, true);
        cli.default.info(`Command '${parent_args_str}${command_name}' not found. Type "${parent_args_str}help" for available commands.`);
    }

    protected async run_sub_help(cmd: CLICMD, parent_args: string[]) {
        const parent_args_str = CLIUtils.parsePArgs(parent_args, true);
        cli.default.info(
            `Command '${parent_args_str}${cmd.name}':\n` +
            `Description: ${cmd.description}\n` +
            `Usage: ${parent_args_str}${cmd.usage}`
        );
    }

    public async run(args: string[], parent_args: string[]) {
        const command_name = args.shift();
        if (!command_name) return await this.run_empty(parent_args);
        if (command_name == "help") return await this.run_help(parent_args);

        const cmd = this.registry[command_name];
        if (!cmd) { return await this.run_notFound(command_name, parent_args); }

        if (args[0] === "--help") return await this.run_sub_help(cmd, parent_args);

        parent_args.push(command_name);
        return await cmd.run(args, parent_args);
    }

}


export default CLICMD;

