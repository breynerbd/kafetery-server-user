import User from "../../../kafetery-server-admin/src/users/user.model.js";

export const getInternalUser = async (authId, email, name = "Usuario Pendiente") => {
    try {
        if (!authId) {
            throw new Error("El campo auth_id es requerido pero llegó undefined");
        }

        let user = await User.findOne({ auth_id: authId });

        if (!user) {
            console.log(`MongoDB | Creando registro para: ${authId}`);
            user = await User.create({
                auth_id: authId,
                name: name,
                email: email,
                loyaltyPoints: 0,
                role: "CLIENT",
                totalOrders: 0,
                isActive: true,
            });
        }
        return user;
    } catch (error) {
        console.error("Error en getInternalUser:", error.message);
        throw error;
    }
};