let grantedAt = 0;

export function markToolAccessGranted() {
	grantedAt = Date.now();
}

export function hasFreshToolAccessGrant() {
	return grantedAt > 0;
}
