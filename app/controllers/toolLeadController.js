import * as toolLeadService from "../services/toolLeadService.js";

export async function handleGetAllToolLeads(options = {}) {
	const { search = "", sourceType = "", toolPage = "", page = 1, limit = 20 } =
		options;
	const result = await toolLeadService.getAllToolLeads({
		search,
		sourceType,
		toolPage,
		page,
		limit,
	});

	return {
		success: true,
		toolLeads: result.toolLeads.map((lead) => ({
			id: lead._id.toString(),
			...lead.toObject(),
		})),
		pagination: result.pagination,
	};
}

export async function handleGetToolLeadById(id) {
	const toolLead = await toolLeadService.getToolLeadById(id);
	if (!toolLead) {
		return { success: false, error: "Tool lead not found" };
	}

	return {
		success: true,
		toolLead: { id: toolLead._id.toString(), ...toolLead.toObject() },
	};
}

export async function handleCreateToolLead(data) {
	const toolLead = await toolLeadService.createToolLead(data);
	return {
		success: true,
		toolLead: { id: toolLead._id.toString(), ...toolLead.toObject() },
	};
}

export async function handleDeleteToolLead(id) {
	const deleted = await toolLeadService.deleteToolLead(id);
	if (!deleted) {
		return { success: false, error: "Tool lead not found" };
	}
	return { success: true };
}
