function createUser(id, name, email, role, photo, provider, verified) {
    return {
        id: id,
        name: name,
        email: email,
        role: role,
        photo: photo,
        provider: provider,
        verified: verified
    };
}
