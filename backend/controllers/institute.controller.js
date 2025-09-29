import {Institute} from "../models/institute.models.js";
import {InstituteCreds} from "../models/institutecreds.models.js";

export const getInstituteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const institute = await Institute.findOne({ _instituteId: id });
        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }
        res.status(200).json({
            name: institute.instituteName,
            email: institute.email,
            location: `${institute.addressLine1}, ${institute.region}, ${institute.pincode}, ${institute.state}, ${institute.country}`,
            contact: institute.phonenumber,
        });
    } catch (error) {
        console.error("Error fetching institute profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateInstituteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, location, contact } = req.body;
        const parts = location.split(',').map(p => p.trim());
        const institute = await Institute.findOneAndUpdate(
            { _instituteId: id },
            {
                instituteName: name,
                email,
                addressLine1: parts[0] || '',
                region: parts[1] || '',
                pincode: parts[2] || '',
                state: parts[3] || '',
                country: parts[4] || '',
                phonenumber: contact,
            },
            { new: true }
        );
        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }
        res.status(200).json({
            name: institute.instituteName,
            email: institute.email,
            location: `${institute.addressLine1}, ${institute.region}, ${institute.pincode}, ${institute.state}, ${institute.country}`,
            contact: institute.phonenumber,
        });
    } catch (error) {
        console.error("Error updating institute profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getInstituteStats = async (req, res) => {
    try {
        const { id } = req.params;
        const creds = await InstituteCreds.findOne({ instituteId: id });
        if (!creds) {
            return res.status(200).json({
                totalIssued: 0,
                verified: 0,
                pending: 0,
                revoked: 0,
            });
        }
        res.status(200).json({
            totalIssued: creds.no_ofCredentialsIssued,
            verified: creds.no_ofVerifiedCredentials,
            pending: creds.no_ofPendingVerifications,
            revoked: creds.no_ofCredentialsRevoked,
        });
    } catch (error) {
        console.error("Error fetching institute stats:", error);
        res.status(500).json({ message: "Server error" });
    }
};
