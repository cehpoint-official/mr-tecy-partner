import { UserProfile, PartnerApplication } from "@/types";
import { userService } from "./user.service";
import { partnerApplicationService } from "./partner.service";
import { serviceService } from "./service.service";

export const partnerMatchingService = {
    /**
     * Get active partners for a specific service
     * Matches partners whose skills include the service category
     */
    async getPartnersForService(serviceId: string): Promise<Array<UserProfile & Partial<PartnerApplication>>> {
        try {
            console.log('[PARTNER MATCHING] Starting for serviceId:', serviceId);

            // 1. Get service details
            const service = await serviceService.getServiceById(serviceId);
            if (!service) {
                console.error('[PARTNER MATCHING] Service not found:', serviceId);
                throw new Error("Service not found");
            }
            console.log('[PARTNER MATCHING] Service:', service.name, 'Category:', service.category);

            // 2. Get all partners (users with role='partner')
            const partners = await userService.getUsersByRole('partner');
            console.log('[PARTNER MATCHING] Total partners:', partners.length);

            // 3. Filter for active partners only
            const activePartners = partners.filter(p => (p.status || 'active') === 'active');
            console.log('[PARTNER MATCHING] Active partners:', activePartners.length);

            // 4. Enrich with application data
            const partnersWithApps = await Promise.all(
                activePartners.map(async (partner) => {
                    const app = await partnerApplicationService.getPartnerStatus(partner.uid);
                    return {
                        ...partner,
                        ...(app || {})
                    } as any;
                })
            );

            // 5. Filter partners whose skills match the service category or name
            const matchedPartners = partnersWithApps.filter(partner => {
                if (!partner.skills || partner.skills.length === 0) {
                    console.log('[PARTNER MATCHING] No skills for partner:', partner.displayName);
                    return false;
                }

                // Match by category or service name
                const hasMatch = partner.skills.some((skill: string) =>
                    skill.toLowerCase().includes(service.category.toLowerCase()) ||
                    service.category.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(service.name.toLowerCase()) ||
                    service.name.toLowerCase().includes(skill.toLowerCase())
                );

                if (hasMatch) {
                    console.log('[PARTNER MATCHING] Match found:', partner.displayName, 'Skills:', partner.skills);
                }

                return hasMatch;
            });

            console.log('[PARTNER MATCHING] Matched partners:', matchedPartners.length);
            return matchedPartners;
        } catch (error) {
            console.error("[PARTNER MATCHING] Error:", error);
            throw error;
        }
    }
};
