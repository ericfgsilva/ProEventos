using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class UserPersist : GeralPersist, IUserPersist
    {
        private readonly ProEventosContext _context;

        public UserPersist(ProEventosContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetUsersAsync() => await _context.Users.ToListAsync();

        public async Task<User> GetUserByIdAsync(Guid id) => await _context.Users.SingleOrDefaultAsync(u => u.Id == id);

        public async Task<User> GetUserByUserNameAsync(string userName) => await _context.Users.SingleOrDefaultAsync(u => u.UserName.ToLower() == userName.ToLower());

        

    }
}