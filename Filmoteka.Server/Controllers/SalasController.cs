
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.Server.Models;
using Filmoteka.Server.Data;

public class SalasController : Controller
{
    private readonly AppDbContext _context;

    public SalasController(AppDbContext context)
    {
        _context = context;
    }

    // GET: SALAS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Sale.ToListAsync());
    }

    // GET: SALAS/Details/5
    public async Task<IActionResult> Details(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var sala = await _context.Sale
            .FirstOrDefaultAsync(m => m.Id == id);
        if (sala == null)
        {
            return NotFound();
        }

        return View(sala);
    }

    // GET: SALAS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: SALAS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Naziv,Kapacitet,Tip,Projekcije")] Sala sala)
    {
        if (ModelState.IsValid)
        {
            _context.Add(sala);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(sala);
    }

    // GET: SALAS/Edit/5
    public async Task<IActionResult> Edit(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var sala = await _context.Sale.FindAsync(id);
        if (sala == null)
        {
            return NotFound();
        }
        return View(sala);
    }

    // POST: SALAS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(System.Guid? id, [Bind("Id,Naziv,Kapacitet,Tip,Projekcije")] Sala sala)
    {
        if (id != sala.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(sala);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalaExists(sala.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(sala);
    }

    // GET: SALAS/Delete/5
    public async Task<IActionResult> Delete(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var sala = await _context.Sale
            .FirstOrDefaultAsync(m => m.Id == id);
        if (sala == null)
        {
            return NotFound();
        }

        return View(sala);
    }

    // POST: SALAS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(System.Guid? id)
    {
        var sala = await _context.Sale.FindAsync(id);
        if (sala != null)
        {
            _context.Sale.Remove(sala);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool SalaExists(System.Guid? id)
    {
        return _context.Sale.Any(e => e.Id == id);
    }
}
