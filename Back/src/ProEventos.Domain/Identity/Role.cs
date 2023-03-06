using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace ProEventos.Domain.Identity
{
    public class Role : IdentityRole<Guid>
    {
        public List<UserRole> UserRoles { get; set; }

    }
}