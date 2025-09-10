import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { VercelDeployer } from '@mastra/deployer-vercel';
import { frontendWorkflow } from './workflows/frontend-workflow';
import { backendWorkflow } from './workflows/backend-workflow';
import { frontendAgent } from './agents/frontend-agent';
import { backendAgent } from './agents/backend-agent';

export const mastra = new Mastra({
	workflows: { frontendWorkflow, backendWorkflow },
	agents: { frontendAgent, backendAgent },
	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ':memory:',
	}),
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
	deployer: new VercelDeployer(),
});
